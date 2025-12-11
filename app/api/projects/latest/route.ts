import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import db from "@/config/db";
import { projectTable, framesTable, usersTable } from "@/config/schema";

export async function GET() {
    try {
        const user = await currentUser();

        // Check if user is authenticated
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userEmail = user.emailAddresses[0]?.emailAddress;

        // Validate email exists
        if (!userEmail) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user exists in database
        const existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.clerkId, user.id))
            .limit(1);

        if (existingUser.length === 0) {
            return NextResponse.json(
                { error: "User not found in database" },
                { status: 404 }
            );
        }

        // Fetch the user's latest project ordered by creation date
        const latestProject = await db
            .select()
            .from(projectTable)
            .where(eq(projectTable.createdBy, userEmail))
            .orderBy(desc(projectTable.createdOn))
            .limit(1);

        // If no projects exist, return null
        if (latestProject.length === 0) {
            return NextResponse.json({
                success: true,
                data: null,
                message: "No projects found"
            });
        }

        const projectId = latestProject[0].projectId;

        // Ensure projectId is not null before querying frames
        if (!projectId) {
            return NextResponse.json({
                success: true,
                data: null,
                message: "Invalid project data"
            });
        }

        // Fetch the latest frame for this project
        const latestFrame = await db
            .select()
            .from(framesTable)
            .where(eq(framesTable.projectId, projectId))
            .orderBy(desc(framesTable.createdOn))
            .limit(1);

        return NextResponse.json({
            success: true,
            data: {
                projectId: projectId,
                frameId: latestFrame.length > 0 ? latestFrame[0].frameId : null,
                createdOn: latestProject[0].createdOn
            },
            message: "Latest project fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching latest project:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
