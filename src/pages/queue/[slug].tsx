import React from 'react';
import Button from '@/components/atoms/Button'
import Layout from '@/components/templates/Layout'
import { useRouter } from 'next/router';
import { BiTimer } from 'react-icons/bi';

export default function Index() {
  const router = useRouter();
  const { slug } = router.query;

  // React.useEffect(() => {}, []);

  return (
    <Layout>
      <h1 className="font-bold text-[20px] text-one">Daftar Antrian</h1>
      <div className="border rounded-[10px] p-5 flex flex-col gap-4 items-center text-center mt-4">
        <div className="flex flex-col justify-center items-center leading-8">
          <h2 className="font-medium text-[14px] text-one">Antrian</h2>
          <h1 className="font-bold text-[32px] text-one">8/10</h1>
          <div className="flex items-center gap-1 text-three text-[12px]">
            <BiTimer size={16} />
            <p>00:00:03</p>
          </div>
        </div>
        <p className="font-medium text-[12px] text-one px-3">Mohon bersabar antrian akan segera berakhir setelah antirn selesai anda akan langsung diarahkan ke dalam bilik suara.</p>
        <Button color="#CA3030" className="text-white my-5" onClick={() => router.back()}>
          Keluar Antrian
        </Button>
      </div>
    </Layout>
  );
}
