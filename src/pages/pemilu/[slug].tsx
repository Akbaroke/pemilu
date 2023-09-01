import * as React from 'react';
import { useRouter } from 'next/router';
import { Chart } from 'primereact/chart';
import Image from 'next/image';
import CopyBtn from '@/components/atoms/CopyBtn'
import Layout from '@/components/templates/Layout'
import { Badge } from '@mantine/core'
import { BiTimer } from 'react-icons/bi'
import { VscDebugDisconnect } from 'react-icons/vsc'
import { IoMdSettings } from 'react-icons/io'
import PEMILU_IMAGE from '@/assets/pemilu-image.png'
import formatCustomDate from '@/utils/formatCustomDate'
import Button from '@/components/atoms/Button'

interface Pemilu {
  id: string;
  slug: string;
  usercreated_id: string;
  name: string;
  start: Date;
  end: Date;
  options: {
    id: string;
    name: string;
    imageUrl: string;
    color: string;
    votes: {
      id: string;
      name: string;
    }[];
  }[];
  rooms: {
    id: string;
    prepare: number;
    expired: number;
    userActive: {
      id: string;
      name: string;
      joiningAt: Date;
    };
  }[];
  queue: {
    id: string;
    name: string;
  }[];
}

const data: Pemilu = {
  id: '1',
  slug: 'ABCD',
  usercreated_id: '1',
  name: 'Pemilihan Ketua RT 08',
  start: new Date(),
  end: new Date(),
  options: [
    {
      id: '1',
      name: 'Prabowo',
      imageUrl: 'https://cdn.discordapp.com/attachments/1015028360759492710/1145555229874593832/prabowo.png',
      color: '#3FBE5B',
      votes: [
        {
          id: '2',
          name: 'Muhammad Hafidz',
        },
      ],
    },
    {
      id: '2',
      name: 'Ganjar',
      imageUrl: 'https://cdn.discordapp.com/attachments/1015028360759492710/1145555229631320074/ganjar.png',
      color: '#FFCF24',
      votes: [
        {
          id: '3',
          name: 'Muhammad Agung',
        },
      ],
    },
    {
      id: '3',
      name: 'Anis',
      imageUrl: 'https://cdn.discordapp.com/attachments/1015028360759492710/1145555230096900177/anis.png',
      color: '#EC4545',
      votes: [
        {
          id: '4',
          name: 'Muhammad Aldi',
        },
      ],
    },
  ],
  rooms: [
    {
      id: '1',
      prepare: 3,
      expired: 60,
      userActive: {
        id: '5',
        name: 'Muhammad Husain',
        joiningAt: new Date(),
      },
    },
  ],
  queue: [
    {
      id: '6',
      name: 'Muhammad Adi',
    },
    {
      id: '7',
      name: 'Muhammad Adi',
    },
    {
      id: '8',
      name: 'Muhammad Adi',
    },
    {
      id: '9',
      name: 'Muhammad Adi',
    },
  ],
};

export default function Index() {
  const router = useRouter();
  const { slug } = router.query;
  const USER_AUTH_ID = '1';
  const [pemilus, setPemilus] = React.useState<Pemilu>();
  const [chartData, setChartData] = React.useState({});
  const [chartOptions, setChartOptions] = React.useState({});

  React.useEffect(() => {
    setPemilus(data);
  }, [router]);

  React.useEffect(() => {
    if (pemilus) {
      const data = {
        labels: pemilus.options.map((val) => val.name),
        datasets: [
          {
            data: pemilus.options.map((val) => val.votes.length),
            label: 'Jumlah Suara',
            backgroundColor: pemilus.options.map((val) => val.color),
            hoverOffset: 4,
          },
        ],
      };
      const options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      };

      setChartData(data);
      setChartOptions(options);
    }
  }, [pemilus]);

  const CreaterPage = () => (
    <div className="flex flex-col gap-[25px]">
      <h1 className="font-bold text-[20px] text-one">{pemilus?.name}</h1>
      <div className="flex flex-col gap-5 border rounded-[10px] p-5">
        <div>
          <h1 className="font-medium text-[14px] text-one">Hasil pemilihan sementara :</h1>
          <Chart type="pie" data={chartData} options={chartOptions} className="w-full sm:w-[250px] m-auto mt-3" />
        </div>
        <div>
          <h1 className="font-medium text-[14px] text-one">Pilihan :</h1>
          <div className="flex flex-col gap-4 mt-3">
            {pemilus?.options.map((value) => (
              <div key={value.id} className="flex items-center gap-4">
                <Image src={value.imageUrl} alt={value.name} width={71} height={71} style={{ border: `4px solid ${value.color}`, borderRadius: '50%' }} />
                <div className="leading-2">
                  <h1 className="font-semibold text-[14px] text-one">{value.name}</h1>
                  <p className="font-medium text-[12px] text-one">Memperoleh {value.votes.length} suara</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border rounded-[10px] p-5 leading-6">
        <h1 className="font-medium text-[14px] text-one">Bagikan tautan :</h1>
        <p className="font-normal text-[12px] text-three">Tautan ini berfungsi untuk melakukan pemilihan.</p>
        <div className="h-[48px] px-[14px] flex items-center justify-between bg-two shadow-inner rounded-[5px] mt-2">
          <p className="text-[12px] font-normal text-one">https://pilihankamu.com/{slug}</p>
          <CopyBtn url={`https://pilihankamu.com/${slug}`} />
        </div>
      </div>
      <div>
        <h1 className="font-semibold text-[16px] text-one">Bilik Suara :</h1>
        <div className="mt-3 flex flex-col gap-3">
          {pemilus?.rooms.map((value) => (
            <div className="border rounded-[10px] p-5" key={value.id}>
              <Badge color="green" className="w-max">
                Bilik {value.id}
              </Badge>
              <div className="flex justify-between items-center mt-3">
                <div className="flex flex-col justify-between gap-2">
                  <h1 className="font-medium text-[14px] text-one">{value.userActive.name}</h1>
                  <div className="text-three font-normal text-[12px] flex items-center gap-1">
                    <BiTimer size={18} />
                    <p>Sisa waktu 1 menit 3 detik</p>
                  </div>
                </div>
                <div className="bg-[#CA3030]/25 w-[35px] h-[35px] rounded-[5px] grid place-items-center cursor-pointer shadow-md transition-all hover:shadow-sm">
                  <VscDebugDisconnect size={20} color="#CA3030" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded-[10px] p-5 leading-6">
        <h1 className="font-medium text-[14px] text-one">Daftar Antrian Pemilih :</h1>
        <div className="leading-7 pl-2 mt-1">
          {pemilus?.queue.map((value, index) => (
            <p key={value.id} className="font-medium text-[14px] text-one">
              {index + 1}
              {`. `}
              {value.name}
            </p>
          ))}
        </div>
      </div>
      <div className="border rounded-[10px] p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
        <h1 className="font-medium text-[14px] text-one">Pengaturan</h1>
        <IoMdSettings size={17} />
      </div>
    </div>
  );

  const VotePage = () => (
    <div>
      <h1 className="font-bold text-[20px] text-one">Daftar Antrian</h1>
      <div className="border rounded-[10px] p-5 flex flex-col gap-5 mt-4">
        <div className="flex items-center gap-4">
          <Image src={PEMILU_IMAGE} alt="image pemilu" className="w-[101px] h-[96px]" />
          <div className="flex flex-col justify-between gap-1">
            <h1 className="text-one text-[14px] font-semibold">{pemilus?.name}</h1>
            <ul className="text-one text-[12px] font-medium leading-5">
              <li>{pemilus?.options.length} Pilihan</li>
              <li>{pemilus?.rooms.length} Bilik Suara</li>
              <li>{pemilus?.queue.length} Antrian</li>
            </ul>
            <div className="flex items-center gap-1 text-three text-[12px]">
              <BiTimer size={16} />
              <p>Berakhir {formatCustomDate(pemilus?.end || new Date())}</p>
            </div>
          </div>
        </div>
        <Button className="text-white w-max m-auto my-2" onClick={() => router.push(`/queue/${slug}`)}>
          Masuk Antrian
        </Button>
      </div>
    </div>
  );

  return (
    <Layout isBackBtn title="Detail Pemilu">
      {data.usercreated_id === USER_AUTH_ID ? <CreaterPage /> : <VotePage />}
    </Layout>
  );
}
