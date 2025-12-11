import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import db from "@/config/db";
import { projectTable, framesTable, chatTable, usersTable } from "@/config/schema";

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

        // Fetch all user projects ordered by creation date (newest first)
        const userProjects = await db
            .select()
            .from(projectTable)
            .where(eq(projectTable.createdBy, userEmail))
            .orderBy(desc(projectTable.createdOn));

        // Fetch frames for each project
        const projectsWithFrames = await Promise.all(
            userProjects.map(async (project) => {
                const projectId = project.projectId;

                if (!projectId) {
                    return {
                        ...project,
                        frame: null,
                        firstPrompt: null
                    };
                }

                const frames = await db
                    .select()
                    .from(framesTable)
                    .where(eq(framesTable.projectId, projectId))
                    .orderBy(desc(framesTable.createdOn))
                    .limit(1);

                const frame = frames.length > 0 ? frames[0] : null;

                // Fetch the first chat message to get the user's prompt
                let firstPrompt = null;
                if (frame?.frameId) {
                    const chatMessages = await db
                        .select()
                        .from(chatTable)
                        .where(eq(chatTable.frameId, frame.frameId))
                        .orderBy(desc(chatTable.createdOn))
                        .limit(1);

                    if (chatMessages.length > 0) {
                        const messages = chatMessages[0].chatMessage as any[];
                        // Find the first user message
                        const userMessage = messages?.find((msg: any) => msg.role === 'user');
                        firstPrompt = userMessage?.content || null;
                    }
                }

                return {
                    ...project,
                    frame,
                    firstPrompt
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: projectsWithFrames,
            message: "Projects fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

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
                { error: "User not found in database. Please create your account first." },
                { status: 404 }
            );
        }

        const { projectId, frameId, messages } = await request.json();

        // Validate required fields
        if (!projectId || !frameId || !messages) {
            return NextResponse.json(
                { error: "Missing required fields: projectId, frameId, and messages are required" },
                { status: 400 }
            );
        }

        // Create project
        const newProject = await db
            .insert(projectTable)
            .values({
                projectId,
                createdBy: userEmail,
            })
            .returning();

        // Create frame
        const newFrame = await db
            .insert(framesTable)
            .values({
                frameId,
                designCode: null,
                projectId,
            })
            .returning();

        // Save chat message
        const newChat = await db
            .insert(chatTable)
            .values({
                chatMessage: messages,
                createdBy: userEmail,
                frameId: frameId,
            })
            .returning();

        return NextResponse.json({
            success: true,
            data: {
                project: newProject[0],
                frame: newFrame[0],
                chat: newChat[0],
            },
            message: "Project, frame, and chat created successfully",
        });
    } catch (error) {
        console.error("Error in project creation:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}