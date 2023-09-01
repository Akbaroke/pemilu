import Layout from '@/components/Layout';
import FormKandidat from '@/views/FormKandidat';

export default function CretePemilu() {
  return (
    <Layout isBackBtn title="Buat Pemilu">
      <h1>Form Kandidat</h1>
      <FormKandidat />
    </Layout>
  );
}
