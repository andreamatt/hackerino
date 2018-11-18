var students_list = {
	1: {
		id: 1,
		email: "mario@rossi.it",
		firstname: "mario",
		lastname: "rossi"
	},
	size: 1
};

const max_students = 10;

function Student(email, firstname, lastname) {
	if (students_list.size > max_students / 2) {
		max_students = max_students * 2;
	}
	this.id = Math.floor(Math.random() * max_students);
	while (students_list[this.id]) {
		this.id = Math.floor(Math.random() * max_students);
	}
	this.email = email;
	this.firstname = firstname;
	this.lastname = lastname;
	this.toString = function(){
		return JSON.stringify(this);
	};
}

function getAllIDs() {
	return Object.keys(students_list);
};

function getAllStudents() {
	return Object.values(students_list);
};

function getById(id) {
	if (students_list[id]) {
		return students_list[id];
	} else {
		console.log('Student with id ' + id + ' does not exist');
		return null;
	}
};

// email is not a unique key => return an array
function getByEmail(email) {
	let result = [];
	for (id in students_list) {
		if (students_list[id].email == email) {
			result.push(students_list[id]);
		}
	}
	return result;
};

function addStudent(email, firstname, lastname) {
	let stud = new Student(email, firstname, lastname);
	students_list[stud.id] = stud;
	students_list.size++;
	console.log(`Added ${stud}`);
	return stud;
};

function addStudentWithID(id, email, firstname, lastname){
	let stud = new Student(email, firstname, lastname);
	stud.id = id;
	students_list[stud.id] = stud;
	students_list.size++;
	console.log(`Added using passed id ${stud}`);
	return stud;
}

function updateStudent(id, email, firstname, lastname) {
	if (students_list[id]) {
		students_list[id].email = email;
		students_list[id].firstname = firstname;
		students_list[id].lastname = lastname;
		console.log(`Modified student ${students_list[id]}`);
		return true;
	}
	return false;
}

function deleteStudent(id) {
	if (students_list[id]) {
		console.log(`Deleted student ${students_list[id]}`);
		delete students_list[id];
		students_list.size--;
		return true;
	}
	return false;
}

addStudent("andrea.matte@studenti.unitn.it", "andrea", "mattè");

module.exports = {getAllIDs, getAllStudents, getById, getByEmail, addStudent, updateStudent, deleteStudent, addStudentWithID};
