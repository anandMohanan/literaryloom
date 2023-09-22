import { Editor } from "@/components/Editor";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Literary Loom - Create Post",
  description: "Create post page",
};

const page = async () => {
  return (
    <div className="flex flex-col items-start gap-6">
      {/* heading */}
      <div className="border-b border-deep-champagne pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
        </div>
      </div>

      {/* form */}
      <Editor />
    </div>
  );
};

export default page;
