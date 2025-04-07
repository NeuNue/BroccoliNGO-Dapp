import { sendEmail } from "@/shared/server/email";
import * as dotenv from "dotenv";
dotenv.config();


async function main() {
  const res = await sendEmail([''], 'Your Animal Rescue Application Has Been Received', `<div style="background: url(https://yf9vh5bpdl1kla2p.public.blob.vercel-storage.com/714/bg-wgvOL861JVUrJ65bH7T0AWDYqPrw6R.png) no-repeat; height: 1000px;width:100%;padding-top: 300px">
    <div style="width: 800px;margin: 0 auto;color:white;font-family:sans-serif;font-size: 18px;">
      <p>
        <b>Dear [@twitterhandle],</b>
      </p>
      <p>Thank you for your passion and dedication to animal welfare. We deeply appreciate your commitment to making a difference.</p>
      <p>At Broccoli, we’re harnessing blockchain technology and the vibrant energy of meme culture to amplify kindness and compassion globally. Your application is an important part of this mission.</p>
      <p>Next Steps:</p>
      <ul>
        <li>Your submission has been recorded and assigned a reference ID: broccoli.ngo/task/{taskid}</li>
        <li>The community review process will begin shortly. You may check your status anytime via the link above.</li>
        <li>Our team will email you with updates or if additional information is needed.</li>
      </ul>
      <p>We’re grateful to have you join us in this effort. Please don’t hesitate to reach out with questions at support@broccoli.ngo.</p>
      <p>With hope and pawsitivity.</p>
      <br>
      <p>
        <b>The Broccoli CTO Team</b>
      </p>
    </div>
  </div>`)
  console.log(res)
}

main();
