import type { Metadata } from "next";
import { SubmitProfileForm } from "./form";

export const metadata: Metadata = {
  title: "Submit Your Profile",
  description:
    "Are you a Filipino fingerstyle guitarist? Submit your profile to be featured on OPM Fingerstyle.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Submit Your Profile
        </h1>
        <p className="mt-2 text-lg text-muted">
          Are you a fingerstyle guitarist performing OPM songs? Submit your
          profile and join our directory. All submissions are reviewed before
          publishing.
        </p>
      </div>

      <SubmitProfileForm />
    </div>
  );
}
