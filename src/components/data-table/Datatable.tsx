import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";

interface Column {
  header: string;
  accessor: string;
  cell?: (row: any) => React.ReactNode;
}

interface Props {
  data: any[];
  columns: Column[];
}

const Datatable: React.FC<Props> = ({ data, columns }) => {
  return (
    <Table>
      <TableHeader className="bg-slate-200">
        <TableRow>
          {columns.map((column: any, index: number) => (
            <TableHead key={index} className="capitalize">
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell>No Results.</TableCell>
          </TableRow>
        ) : (
          <>
            {data.map((row: any) => (
              <TableRow key={row.id}>
                {columns.map((column: any, index: number) => (
                  <TableCell key={index}>
                    {column.cell ? column.cell(row) : row[column.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  );
};

export default Datatable;
