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
      <li>
        {user.name}
        {"   "}
        {is_user ? (
          <b>
            <i>me</i>
          </b>
        ) : (
          ""
        )}
        {"   "}
        {is_owner ? (
          <i>
            <b>owner</b>
          </i>
        ) : (
          ""
        )}
      </li>
    </p>
  );
}
