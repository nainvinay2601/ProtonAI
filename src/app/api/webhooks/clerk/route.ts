//Need the prisma global connection first
import { prisma } from "@/lib/prisma";

import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

//Define the type of the webhook event
//Whenever we are getting the data from external source , which is webhook in this case so we should define the type like what we are getting and what we are sure about
//- basically just dont trust outer source data blindly and define it before for safety and saving time in some error where the data doesnt exist that we are trying to accomplish

type ClerkWebhookEvent = {
  type: "user.created" | "user.deleted" | "user.updated";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    // Bring the data
    const evt = (await verifyWebhook(req)) as ClerkWebhookEvent; // verify the webhook get the payload ( request ) stored in the evt -> event

    // destruct the id out of the data stored in the evt

    console.log("Received Clerk Webhook:", evt.type);

    const { id: clerkId } = evt.data;
    const email = evt.data.email_addresses[0]?.email_address;

    //Validate id and the email
    if (!clerkId || !email) {
      throw new Error("Missing email or the ID ");
    }

    // Case when hook registered an action

    if (evt.type === "user.created" || evt.type === "user.updated") {
      //Destruct the data and update user in the database using prisma

      const { first_name, last_name, image_url } = evt.data;

      await prisma.user.upsert({
        where: { id: clerkId }, // use the id as clerkId
        update: {
          email,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
        create: {
          id: clerkId, // Directly use the clerkId as the id
          email,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
      });
    } else if (evt.type === "user.deleted") {
      await prisma.user.delete({
        where: { id: clerkId },
      });
    }

    //Throw the response as soon the event has been handled
    // throw new Response("User Synced to the database", { status: 200 }); -> throw is for uneven event like error or something but when success use the return keyword
    return new Response("User Synced to the database", { status: 200 });
  } catch (error) {
    console.log("Unable to use webhook", error);
    return new Response("Webhook Error", { status: 400 });
  }
}
