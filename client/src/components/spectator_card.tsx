import { CircleUser, Crown } from "lucide-react";
import type { components } from "../schema";

interface SpecatatorProps {
  user: components["schemas"]["UserSchema"];
  is_owner: boolean;
  is_user: boolean;
}
export default function SpecatatorCard({
  user,
  is_owner,
  is_user,
}: SpecatatorProps) {
  return (
    <p>
      <li className="flex gap-3">
        {user.name}
        {"   "}
        {is_user ? (
          <CircleUser />
        ) : (
          ""
        )}
        {"   "}
        {is_owner ? (
          <Crown />
        ) : (
          ""
        )}
      </li>
    </p>
  );
}
