import db from "@/config/db";
import { chatTable, framesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url)
   const frameId = searchParams.get('frameId')
   const projectId = searchParams.get('projectId')

   // Validate required parameters
   if (!frameId) {
      return NextResponse.json(
         { error: "frameId is required" },
         { status: 400 }
      );
   }

   try {
      const frameResult = await db.select().from(framesTable).where(eq(framesTable.frameId, frameId))
      const chatResult = await db.select().from(chatTable).where(eq(chatTable.frameId, frameId))

      if (frameResult.length === 0) {
         return NextResponse.json(
            { error: "Frame not found" },
            { status: 404 }
         );
      }

      const finalResult = {
         ...frameResult[0],
         chatMessages: chatResult.length > 0 ? chatResult[0].chatMessage : []
      }

      return NextResponse.json(finalResult);
   } catch (error) {
      console.error("Error fetching frame:", error);
      return NextResponse.json(
         { error: "Failed to fetch frame" },
         { status: 500 }
      );
   }
}

export async function PUT(request: NextRequest) {
   try {
      const body = await request.json();
      const { frameId, messages, userEmail, designCode } = body;

      // Validate required parameters
      if (!frameId || !messages) {
         return NextResponse.json(
            { error: "frameId and messages are required" },
            { status: 400 }
         );
      }

      // Update designCode in framesTable if provided
      if (designCode !== undefined) {
         await db.update(framesTable)
            .set({ designCode: designCode })
            .where(eq(framesTable.frameId, frameId));
      }

      // Check if chat record exists for this frameId
      const existingChat = await db.select().from(chatTable).where(eq(chatTable.frameId, frameId));

      if (existingChat.length > 0) {
         // Update existing chat record
         await db.update(chatTable)
            .set({ chatMessage: messages })
            .where(eq(chatTable.frameId, frameId));
      } else {
         // Insert new chat record
         await db.insert(chatTable).values({
            frameId: frameId,
            chatMessage: messages,
            createdBy: userEmail || null
         });
      }

      return NextResponse.json({ success: true, message: "Frame data saved successfully" });
   } catch (error) {
      console.error("Error saving frame data:", error);
      return NextResponse.json(
         { error: "Failed to save frame data" },
         { status: 500 }
      );
   }
}