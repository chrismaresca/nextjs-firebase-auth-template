"use client";

import { UserCredential, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithEmailLink } from "firebase/auth";
import Link from "next/link";
import * as React from "react";
import { useLoadingCallback } from "react-loading-hook";
import { loginWithCredential } from "@/app/api";

// UI Imports
import { Button } from "@/ui/Button/Button";
import { ButtonGroup } from "@/ui/ButtonGroup/ButtonGroup";
import { PasswordForm, PasswordFormValue } from "@/ui/PasswordForm/PasswordForm";

import { getFirebaseAuth } from "@/auth/firebase";
import { appendRedirectParam } from "@/shared/redirect";
import { useRedirectAfterLogin } from "@/shared/useRedirectAfterLogin";
import { useRedirectParam } from "@/shared/useRedirectParam";
import { getGoogleProvider, loginWithProvider } from "./firebase";



export function LoginPage() {
  const [hasLogged, setHasLogged] = React.useState(false);
  const redirect = useRedirectParam();
  const redirectAfterLogin = useRedirectAfterLogin();

  async function handleLogin(credential: UserCredential) {
    await loginWithCredential(credential);
    redirectAfterLogin();
  }

  const [handleLoginWithEmailAndPassword, isEmailLoading, emailPasswordError] = useLoadingCallback(async ({ email, password }: PasswordFormValue) => {
    setHasLogged(false);

    const auth = getFirebaseAuth();
    await handleLogin(await signInWithEmailAndPassword(auth, email, password));

    setHasLogged(true);
  });

  const [handleLoginWithGoogle, isGoogleLoading, googleError] = useLoadingCallback(async () => {
    setHasLogged(false);

    const auth = getFirebaseAuth();
    await handleLogin(await loginWithProvider(auth, getGoogleProvider(auth)));

    setHasLogged(true);
  });

  const [handleLoginWithEmailLink, isEmailLinkLoading, emailLinkError] = useLoadingCallback(async () => {
    const auth = getFirebaseAuth();
    const email = window.prompt("Please provide your email");

    if (!email) {
      return;
    }

    window.localStorage.setItem("emailForSignIn", email);

    await sendSignInLinkToEmail(auth, email, {
      url: process.env.NEXT_PUBLIC_ORIGIN + "/login",
      handleCodeInApp: true,
    });
  });

  async function handleLoginWithEmailLinkCallback() {
    const auth = getFirebaseAuth();
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      return;
    }

    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    }

    if (!email) {
      return;
    }

    setHasLogged(false);

    await handleLogin(await signInWithEmailLink(auth, email, window.location.href));
    window.localStorage.removeItem("emailForSignIn");

    setHasLogged(true);
  }

  React.useEffect(() => {
    handleLoginWithEmailLinkCallback();
  }, []);

  return (
    <div>
      Login
      {hasLogged && (
        <div>
          <span>
            Redirecting to <strong>{redirect || "/"}</strong>
          </span>
          {/* <LoadingIcon /> */}
        </div>
      )}
      {!hasLogged && (
        <PasswordForm loading={isEmailLoading} onSubmit={handleLoginWithEmailAndPassword} error={emailPasswordError || googleError || emailLinkError}>
          <ButtonGroup>

            <Link href={appendRedirectParam("/reset-password", redirect)}>
              Reset password
            </Link>
            <Link href={appendRedirectParam("/register", redirect)}>
              <Button>Register</Button>
            </Link>
            <Button loading={isGoogleLoading} disabled={isGoogleLoading} onClick={handleLoginWithGoogle}>
              Log in with Google (Popup)
            </Button>

            <Button loading={isEmailLinkLoading} disabled={isEmailLinkLoading} onClick={handleLoginWithEmailLink}>
              Log in with Email Link
            </Button>
          </ButtonGroup>
        </PasswordForm>
      )}
    </div>
  );
}
