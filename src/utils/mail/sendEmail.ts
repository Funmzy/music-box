import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import mg from "nodemailer-mailgun-transport";

const sendEmail = async (
  email: string,
  subject: string,
  payload: Record<string, string>,
  template: string
  // eslint-disable-next-line consistent-return
): Promise<unknown> => {
  try {
    // Create a nodemailer transporter with the outlook mail account
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    // Template source which contains specific email format
    const templateSource = fs.readFileSync(
      path.join(__dirname, "../../../templates/", template),
      "utf8"
    );
    // Compile template with handlebars compile method
    const compiledTemplate = handlebars.compile(templateSource);
    const options = () => {
      return {
        from: "MUSIC BOX <musicboxb@outlook.com>",
        to: email,
        subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    return transporter.sendMail(options(), (error, info) => {
      if (error) {
        return error;
      }
      return { info };
    });
  } catch (error) {
    return error;
  }
};

export default sendEmail;
