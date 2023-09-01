import { CopyButton, ActionIcon, Tooltip } from '@mantine/core';
import { HiOutlineClipboard } from 'react-icons/hi';
import { BsCheck } from 'react-icons/bs';

type Props = {
  url: string;
};

function CopyBtn({ url }: Props) {
  return (
    <CopyButton value={url} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="top">
          <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
            {copied ? <BsCheck size="1rem" /> : <HiOutlineClipboard size="1rem" />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
}

export default CopyBtn;
