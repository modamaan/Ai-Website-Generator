import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/config/db";
import { projectTable, framesTable, chatTable, usersTable } from "@/config/schema";

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
                projectId,
            })
            .returning();

        // Save chat message
        const newChat = await db
            .insert(chatTable)
            .values({
                chatMessage: messages,
                createdBy: userEmail,
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