import { Resend } from "resend";

export const sendLeadEmail =
  async (email) => {

    try {

      const resend = new Resend(
        process.env.RESEND_API_KEY
      );

      await resend.emails.send({

        from:
          "SpendPilot AI <onboarding@resend.dev>",

        to: email,

        subject:
          "Your SpendPilot AI Optimization Summary",

        html: `
          <div style="font-family: Arial; padding: 24px;">

            <h1>
              Thanks for using SpendPilot AI
            </h1>

            <p>
              Your AI spend audit was successfully generated.
            </p>

            <p>
              We’ll continue sending future optimization insights and AI infrastructure recommendations.
            </p>

            <p>
              — SpendPilot AI
            </p>

          </div>
        `,
      });

      console.log(
        "Email sent successfully"
      );

    } catch (error) {

      console.log(error);
    }
};