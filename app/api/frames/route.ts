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