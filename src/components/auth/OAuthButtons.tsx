import { Button } from "antd";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { startOAuth } from "../../api/auth";

export function OAuthButtons() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button size="large" icon={<FaGithub className="size-4" />} onClick={() => startOAuth("github")}>
          GitHub
        </Button>
        <Button size="large" icon={<FcGoogle className="size-4" />} onClick={() => startOAuth("google")}>
          Google
        </Button>
      </div>
      <div className="my-6 flex items-center gap-3 text-2xs font-medium tracking-wider text-muted uppercase">
        <span className="h-px flex-1 bg-line" />
        Or continue with email
        <span className="h-px flex-1 bg-line" />
      </div>
    </>
  );
}
