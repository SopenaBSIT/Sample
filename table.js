// Get year from URL
const params = new URLSearchParams(window.location.search);
const year = params.get("year");
const user = localStorage.getItem("currentUser");
if(!user) window.location.href = "login.html";

// Set title
document.getElementById("yearTitle").innerText = "Student Data - " + year;

// Generate 500 rows
const tbody = document.getElementById("table_body");
const fragment = document.createDocumentFragment();

for(let i=1; i<=500; i++){
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="number" class="student-id" placeholder="${i}"></td>
    <td><input type="text" class="name"></td>
    <td><input type="text" class="sex" placeholder="M/F"></td>
    <td><input type="text" class="birthday date-input" placeholder="MM-DD-YYYY"></td>
    <td><input type="text" class="appointment date-input" placeholder="MM-DD-YYYY"></td>
    <td><span class="age"></span></td>
    <td><input type="number" class="height" placeholder="cm"></td>
    <td><input type="number" class="weight" placeholder="kg"></td>
    <td><span class="status">Waiting...</span></td>
  `;
  fragment.appendChild(row);
}
tbody.appendChild(fragment);

// Listen to all input events
document.addEventListener("input", function(e){
  const row = e.target.closest("tr");
  if(!row) return;

  // Auto-format date
  if(e.target.classList.contains("date-input")){
    e.target.value = e.target.value.replace(/[^0-9-]/g,"");
    formatDateInput(e.target);
  }

  // Load student data if ID exists
  if(e.target.classList.contains("student-id")){
    loadStudent(row);
  }

  // Save student info
  if(e.target.classList.contains("name") || e.target.classList.contains("sex") || e.target.classList.contains("birthday")){
    saveStudent(row);
  }

  calculateAge(row);
  calculateBMI(row);
});

// ------------------------
// Date formatting
function formatDateInput(input){
  let value = input.value.replace(/\D/g,"");
  if(value.length>2 && value.length<=4){
    value = value.slice(0,2) + "-" + value.slice(2);
  } else if(value.length>4){
    value = value.slice(0,2) + "-" + value.slice(2,4) + "-" + value.slice(4,8);
  }
  input.value = value;
}

// ------------------------
// Age calculation
function calculateAge(row){
  const birthday = row.querySelector(".birthday").value;
  const appointment = row.querySelector(".appointment").value;
  const ageSpan = row.querySelector(".age");
  if(!birthday){ ageSpan.innerText=""; return; }

  const b = birthday.split("-");
  if(b.length!==3) return;
  const birth = new Date(b[2], b[0]-1, b[1]);
  const ref = appointment && appointment.split("-").length===3 ? 
              new Date(appointment.split("-")[2], appointment.split("-")[0]-1, appointment.split("-")[1]) : 
              new Date();
  
  let age = ref.getFullYear() - birth.getFullYear();
  if(ref.getMonth()<birth.getMonth() || (ref.getMonth()===birth.getMonth() && ref.getDate()<birth.getDate())){
    age--;
  }
  ageSpan.innerText = (age>=6 && age<=12)? age : "";
}

// ------------------------
// BMI calculation
function calculateBMI(row){
  const h=parseFloat(row.querySelector(".height").value);
  const w=parseFloat(row.querySelector(".weight").value);
  const age=parseInt(row.querySelector(".age").innerText);
  const status=row.querySelector(".status");

  if(!isNaN(age) && h>0 && w>0){
    const bmi=(w/((h/100)**2)).toFixed(1);
    let text="Normal", color="green";
    if(bmi<14.5){ text="Wasted"; color="red"; }
    else if(bmi>22){ text="Overweight"; color="orange"; }
    status.innerText = `${text} (${bmi})`;
    status.style.color=color;
  } else {
    status.innerText="Waiting...";
    status.style.color="black";
  }
}

// ------------------------
// Save student info (current year + master)
function saveStudent(row){
  const id=row.querySelector(".student-id").value;
  if(!id) return;

  const student = {
    name: row.querySelector(".name").value,
    sex: row.querySelector(".sex").value,
    birthday: row.querySelector(".birthday").value
  };

  // Save to current year
  localStorage.setItem(`${user}_student_${id}_${year}`, JSON.stringify(student));
  
  // Save/update master database for future years
  localStorage.setItem(`${user}_student_${id}_master`, JSON.stringify(student));
}

// ------------------------
// Load student info (current year first, then master)
function loadStudent(row){
  const id=row.querySelector(".student-id").value;
  if(!id) return;

  const currentKey = `${user}_student_${id}_${year}`;
  const masterKey  = `${user}_student_${id}_master`;

  let data = localStorage.getItem(currentKey);
  if(!data){
    data = localStorage.getItem(masterKey);
  }
  if(!data) return;

  const student = JSON.parse(data);
  row.querySelector(".name").value = student.name;
  row.querySelector(".sex").value = student.sex;
  row.querySelector(".birthday").value = student.birthday;

  calculateAge(row);
}