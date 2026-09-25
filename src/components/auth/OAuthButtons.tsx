import { Button, Divider } from "antd";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { startOAuth } from "../../api/auth";

export function OAuthButtons() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Button size="large" block icon={<FaGithub />} onClick={() => startOAuth("github")}>
          Continue with GitHub
        </Button>
        <Button size="large" block icon={<FcGoogle />} onClick={() => startOAuth("google")}>
          Continue with Google
        </Button>
      </div>
      <Divider plain className="my-6 text-xs text-muted">
        or with email
      </Divider>
    </>
  );
}
