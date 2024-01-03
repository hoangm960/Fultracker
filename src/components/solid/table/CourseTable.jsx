import EditIcon from "@assets/icons/Edit.svg";
import DeleteIcon from "@assets/icons/delete.png";


export function CourseTable() {
    const tableBody = 
        <tbody class=" bg-background flex flex-col items-center justify-between overflow-y-scroll w-full rounded-xl">
            {
                [...Array(60).keys()].map((num) => 
                    <CourseRow num={num + 1}>
                        
                    </CourseRow>
                )
            }
        </tbody>

    return <table class="table-auto w-full h-full text-left">
    <thead class="bg-action flex w-full rounded-xl">
      <tr class="flex mb-4 w-full">
        <th
          scope="row"
          class="text-highlight p-4 w-1/12"
          style="font: 600 26px 'Montserrat', sans-serif"
        >
          No.
        </th>
  
        <th
          scope="row"
          class="text-highlight p-4 w-1/6"
          style="font: 600 26px 'Montserrat', sans-serif"
        >
          Term
        </th>
  
        <th
          scope="row"
          class="text-highlight p-4 w-1/6"
          style="font: 600 26px 'Montserrat', sans-serif"
        >
          Code
        </th>
  
        <th
          scope="row"
          class="text-highlight p-4 flex-1 text-center"
          style="font: 600 26px 'Montserrat', sans-serif"
        >
          Title
        </th>
  
        <th
          scope="row"
          class="text-highlight p-4 w-[10%]"
          style="font: 600 26px 'Montserrat', sans-serif"
        >
          Grade
        </th>
  
        <th
          scope="row"
          class="text-highlight p-4 w-[12%]"
          style="font: 600 26px 'Montserrat', sans-serif"
        >
          Actions
        </th>
      </tr>
    </thead>
    {tableBody}
  </table>
}

function CourseRow({num, term="Term", code="Course Code", title="Course Name", grade="Grade"}) {
    return <tr class="flex w-full mb-4 items-center" id="courseRow">
    <td
      class="text-text p-4 w-1/12"
      style="font: 500 20px 'Montserrat', sans-serif"
      id="num"
    >
      {num}
    </td>
    <td
      class="text-text p-4 w-1/6"
      style="font: 500 20px 'Montserrat', sans-serif"
      id="term"
    >
      {term}
    </td>
    <td
      class="text-text p-4 w-1/6"
      style="font: 500 20px 'Montserrat', sans-serif"
      id="code"
    >
      {code}
    </td>
    <td
      class="text-text p-4 flex-1 text-center"
      style="font: 500 20px 'Montserrat', sans-serif"
      id="title"
    >
      {title}
    </td>
    <td
      class="text-text p-4 w-1/12"
      style="font: 500 20px 'Montserrat', sans-serif"
      id="grade"
    >
      {grade}
    </td>
    <td
      class="text-text p-4 w-[12%]"
      style="font: 500 20px 'Montserrat', sans-serif"
    >
        <div class="flex flex-row gap-5">
            <button
                class="active:bg-active-light h-fit rounded-2xl flex flex-row gap-5 items-center justify-start hover:shadow-2xl hover:opacity-80 cursor-pointer border-[3px] border-highlight border-solid p-1"
                id="editCourse"
            >
                <img
                    class="h-8"
                    src={EditIcon.src}
                    alt="Edit Course"
                />
            </button>
            <button
                class="active:bg-active-light h-fit rounded-2xl flex flex-row gap-5 items-center justify-start hover:shadow-2xl hover:opacity-80 cursor-pointer border-[3px] border-highlight border-solid p-1"
                id="deleteCourse"
            >
                <img
                    class="h-8"
                    src={DeleteIcon.src}
                    alt="Delete Course"
                />
            </button>
        </div>
    </td>
  </tr>
}