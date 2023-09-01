import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import { Loader } from '@mantine/core';

export default function GoogleAuthButton({ title }: { title: string }) {
  const { query } = useRouter();
  const callbackUrl: any = query.callbackUrl || '/';
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <button
      type="button"
      className="text-one font-medium text-[14px] flex justify-center items-center gap-[10px] border border-two w-full h-[37px] rounded-[10px] hover:shadow-md transition-all duration-300"
      onClick={() => {
        setIsLoading(true);
        signIn('google', {
          redirect: false,
          callbackUrl,
        }).finally(() => {
          setIsLoading(false);
        });
      }}>
      <FcGoogle size={18} />
      {isLoading ? <Loader style={{ fill: '#000' }} variant="dots" size="sm" /> : title}
    </button>
  );
}
