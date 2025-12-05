import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/config/db";
import { usersTable } from "@/config/schema";

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

        // Check if user already exists in database
        const existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.clerkId, user.id))
            .limit(1);

        if (existingUser.length > 0) {
            // User already exists, return existing user data
            return NextResponse.json({
                success: true,
                user: existingUser[0],
                message: "User already exists",
            });
        }

        // Prepare user data with proper fallbacks
        const userName = user.fullName || user.firstName || user.username || "";
        const userEmail = user.emailAddresses[0]?.emailAddress;

        // Validate email exists
        if (!userEmail) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Create new user
        const newUser = await db
            .insert(usersTable)
            .values({
                clerkId: user.id,
                name: userName,
                email: userEmail,
            })
            .returning();

        return NextResponse.json({
            success: true,
            user: newUser[0],
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Error in user creation:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
