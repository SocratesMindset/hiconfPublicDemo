import { useSetAtom } from "jotai";
import { authAtom } from "../actions/atom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../actions/user";

export function LogoutBtn() {
  const setAuth = useSetAtom(authAtom);

  const { mutate: logoutUser, } = useMutation(
    {
      mutationFn: () => logout(),

      onSuccess: () => {
        setAuth(false);
        console.log("login");
        localStorage.setItem("auth", "false");
        // store.setRequestLoading(false);
        // toast.success("You successfully logged in");
        // navigate(from);
      },
      onError: (error) => {
        // store.setRequestLoading(false);
        console.error(error);
      },
    }
  );

  return <a className="navEnter" onClick={() => logoutUser()}>Выход</a>;
}
