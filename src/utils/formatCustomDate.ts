import { format } from 'date-fns';

function formatCustomDate(date: Date): string {
  const formattedDate = format(date, 'HH:mm - dd/MM/yy');
  return formattedDate;
}

export default formatCustomDate;
