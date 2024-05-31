import { useState, useMemo } from "react";
import Datatable from "./components/data-table/Datatable";

type DataItem = any;

// const sampleData: DataItem[] = [
//   {
//     id: 1,
//     mall: "V R mall",
//     address: "Surat",
//     rating: "A",
//   },
//   {
//     id: 2,
//     mall: "Rahul Raj Mall",
//     address: "dallas",
//     rating: "B",
//   },
//   {
//     id: 3,
//     mall: "Raj Imperial",
//     address: "san francisco",
//     category: "one",
//     rating: "B",
//   },
//   {
//     id: 4,
//     mall: "jane",
//     address: "denver",
//     category: "two",
//     rating: "C",
//   },
// ];
const sampleData: DataItem[] = [
  {
    id: 1,
    name: "foo",
    city: "dallas",
    category: "one",
    type: "A",
    active: "FALSE",
  },
  {
    id: 2,
    name: "bar",
    city: "dallas",
    category: "one",
    type: "B",
    active: "FALSE",
  },
  {
    id: 3,
    name: "jim",
    city: "san francisco",
    category: "one",
    type: "B",
    active: "TRUE",
  },
  {
    id: 4,
    name: "jane",
    city: "denver",
    category: "two",
    type: "C",
    active: "FALSE",
  },
];
function App() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dynamic columns for the data table
  const dynamicColumns = (data: DataItem[]): any[] => {
    const allKeys = data.reduce((keys: Set<string>, item: DataItem) => {
      Object.keys(item).forEach((key) => keys.add(key));
      return keys;
    }, new Set<string>());

    return Array.from(allKeys).map((key) => ({
      header: key,
      accessor: key,
      cell: (row: DataItem) =>
        row[key] !== undefined ? (
          <span className="capitalize">{row[key]}</span>
        ) : (
          "--"
        ),
    }));
  };

  // Transform data for generating filters
  const transformData = (data: DataItem[]): Record<string, Set<string>> => {
    const newData: Record<string, Set<string>> = {};
    data.forEach((item) => {
      for (let key in item) {
        newData[key] = newData[key] || new Set();
        newData[key].add(String(item[key]));
      }
    });
    return newData;
  };

  const transformedData = useMemo(() => transformData(sampleData), []);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setSelectedItems((prev) => {
      const newItems = new Set(prev);
      if (checked) {
        newItems.add(value);
      } else {
        newItems.delete(value);
      }
      return Array.from(newItems);
    });
  };

  // Filtered data
  const filteredData = useMemo(() => {
    let filtered = sampleData;

    // filters
    if (selectedItems.length > 0) {
      filtered = filtered.filter((item) =>
        selectedItems.every((selectedItem) =>
          Object.values(item).includes(selectedItem)
        )
      );
    }

    if (transformedData.hasOwnProperty("name") && searchQuery.trim() !== "") {
      filtered = filtered.filter((item) =>
        String(item.name)
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      );
    }

    return filtered;
  }, [selectedItems, searchQuery]);

  return (
    <>
      <div className="container my-10 px-10">
        {/* Render checkboxes for filtering */}
        <div className="flex items-start justify-around mb-10">
          {Object.keys(transformedData).map((key) => {
            if (key === "id" || key === "name") {
              return null;
            }
            return (
              <div
                key={key}
                className="flex flex-col border-r border-black px-10"
              >
                <span className="capitalize font-bold">{key}</span>
                {Array.from(transformedData[key]).map((value) => (
                  <label
                    key={String(value)}
                    className="flex items-center gap-1"
                  >
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(String(value), e.target.checked)
                      }
                    />
                    <span className="capitalize cursor-pointer">
                      {String(value)}
                    </span>
                  </label>
                ))}
              </div>
            );
          })}
          {/* search box */}
          {transformedData.hasOwnProperty("name") && (
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>

        {/* Data table */}
        <Datatable columns={dynamicColumns(sampleData)} data={filteredData} />
      </div>
    </>
  );
}

export default App;
