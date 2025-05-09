import { IconButton } from '@mui/joy'
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

type Props<T> = {
  data: T[];
  itemsPerPage: number;
  setData: Dispatch<SetStateAction<T[]>>;
}

function Pagination<T>({ data, itemsPerPage, setData }: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setData(data.slice(startIndex, endIndex));
  }, [currentPage, data, setData, itemsPerPage, totalPages]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "16px",
      }}
    >
      <IconButton
        aria-label="previous page"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        aria-label="next page"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </div>
  )
}

export default Pagination