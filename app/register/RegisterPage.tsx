"use client";

import * as React from "react";
import { useLoadingCallback } from "react-loading-hook";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Link from "next/link";
import { getFirebaseAuth } from "@/auth/firebase";
import { loginWithCredential } from "@/app/api";

import { Button } from "@/ui/Button/Button";
import { PasswordForm, PasswordFormValue } from "@/ui/PasswordForm/PasswordForm";

import { appendRedirectParam } from "@/shared/redirect";
import { useRedirectAfterLogin } from "@/shared/useRedirectAfterLogin";
import { useRedirectParam } from "@/shared/useRedirectParam";

export function RegisterPage() {
  const [hasLogged, setHasLogged] = React.useState(false);
  const redirect = useRedirectParam();
  const redirectAfterLogin = useRedirectAfterLogin();

  const [registerWithEmailAndPassword, isRegisterLoading, error] = useLoadingCallback(async ({ email, password }: PasswordFormValue) => {
    setHasLogged(false);
    const auth = getFirebaseAuth();
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await loginWithCredential(credential);
    await sendEmailVerification(credential.user);
    redirectAfterLogin();

    setHasLogged(true);
  });

  return (
    <div>
      {hasLogged && (
        <div>
          <span>
            Redirecting to <strong>{redirect || "/"}</strong>
          </span>
        </div>
      )}
      {!hasLogged && (
        <PasswordForm onSubmit={registerWithEmailAndPassword} loading={isRegisterLoading} error={error}>
          <Link href={appendRedirectParam("/login", redirect)}>
            <Button disabled={isRegisterLoading}>Back to login</Button>
          </Link>
        </PasswordForm>
      )}
    </div>
  );
}
