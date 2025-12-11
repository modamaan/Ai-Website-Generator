import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/config/db";
import { framesTable, deployedSitesTable, usersTable, projectTable } from "@/config/schema";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const user = await currentUser();

        // Check if user is authenticated
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { projectId, frameId } = await request.json();
        console.log('📦 Deployment request:', { projectId, frameId });

        // Validate required fields
        if (!projectId || !frameId) {
            return NextResponse.json(
                { error: "Missing required fields: projectId and frameId are required" },
                { status: 400 }
            );
        }

        // Get the frame data (contains the generated HTML)
        const frame = await db
            .select()
            .from(framesTable)
            .where(eq(framesTable.frameId, frameId))
            .limit(1);

        if (frame.length === 0 || !frame[0].designCode) {
            console.error('❌ No generated code found for frameId:', frameId);
            return NextResponse.json(
                { error: "No generated code found for this project. Please generate a website first." },
                { status: 404 }
            );
        }

        const htmlCode = frame[0].designCode;
        console.log('✅ Found HTML code, length:', htmlCode.length);

        // Check if Vercel token is configured
        if (!process.env.VERCEL_TOKEN) {
            console.error('❌ VERCEL_TOKEN not configured');
            return NextResponse.json(
                { error: "Vercel token not configured. Please add VERCEL_TOKEN to your environment variables." },
                { status: 500 }
            );
        }

        // Get project details for naming
        const project = await db
            .select()
            .from(projectTable)
            .where(eq(projectTable.projectId, projectId))
            .limit(1);

        // Generate a unique project name for Vercel
        const projectName = `ai-website-${projectId.slice(0, 8)}-${Date.now()}`;
        console.log('🚀 Deploying as:', projectName);

        // Ensure HTML is a complete document
        let completeHtml = htmlCode.trim();
        if (!completeHtml.toLowerCase().startsWith('<!doctype')) {
            // Wrap body content in a complete HTML document
            completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
${completeHtml}
</body>
</html>`;
        }

        // Prepare deployment payload for Vercel
        const deploymentPayload = {
            name: projectName,
            files: [
                {
                    file: "index.html",
                    data: completeHtml
                }
            ],
            projectSettings: {
                framework: null
            }
        };

        console.log('📤 Sending deployment to Vercel...');

        // Deploy to Vercel
        const vercelResponse = await fetch('https://api.vercel.com/v13/deployments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deploymentPayload)
        });

        const responseText = await vercelResponse.text();
        console.log('📥 Vercel response status:', vercelResponse.status);
        console.log('📥 Vercel response:', responseText.substring(0, 500));

        if (!vercelResponse.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch (e) {
                errorData = { message: responseText };
            }
            console.error('❌ Vercel deployment error:', errorData);
            return NextResponse.json(
                { error: `Deployment failed: ${errorData.error?.message || errorData.message || 'Unknown error'}` },
                { status: vercelResponse.status }
            );
        }

        const deploymentData = JSON.parse(responseText);
        const deploymentUrl = `https://${deploymentData.url}`;
        console.log('✅ Deployment successful:', deploymentUrl);



        // Save deployment information to database
        const siteId = uuidv4();
        const deployedSite = await db
            .insert(deployedSitesTable)
            .values({
                siteId,
                userId: user.id,
                projectId,
                customData: null,
                deploymentUrl,
                deploymentStatus: deploymentData.readyState || 'BUILDING',
                deploymentPlatform: 'vercel',
            })
            .returning();

        console.log('💾 Saved to database:', siteId);

        return NextResponse.json({
            success: true,
            data: {
                deploymentUrl,
                deploymentId: deploymentData.id,
                status: deploymentData.readyState,
                siteId,
            },
            message: "Deployment initiated successfully"
        });

    } catch (error: any) {
        console.error("❌ Error in deployment:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            {
                error: "Internal server error during deployment",
                details: error.message
            },
            { status: 500 }
        );
    }
}
