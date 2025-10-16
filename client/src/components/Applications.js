/** @format */
import { useSelector } from "react-redux";
import InternApp from "./InternApp";
import CompApp from "./CompApp";

export default function Applications({ ping, setPing }) {
  const user = useSelector((state) => state.user?.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading user data...
      </div>
    );
  }

  return user.role === "intern" ? (
    <InternApp ping={ping} setPing={setPing} />
  ) : (
    <CompApp ping={ping} setPing={setPing} />
  );
}
