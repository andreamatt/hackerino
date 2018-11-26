const students_list = {
	/*
	1: {
		id: 1,
		email: "mario@rossi.it",
		firstname: "mario",
		lastname: "rossi"
	}
	*/
};
let size = 0;
let max_students = 10;

function Student(email, firstname, lastname) {
	if (size > max_students / 2) {
		max_students = max_students * 2;
	}
	this.id = Math.floor(Math.random() * max_students);
	while (students_list[this.id]) {
		this.id = Math.floor(Math.random() * max_students);
	}
	this.email = email;
	this.firstname = firstname;
	this.lastname = lastname;
	this.toString = function () {
		return JSON.stringify(this);
	};
}

function getAllIDs() {
	return Object.keys(students_list);
};

function getAllStudents() {
	let students = Object.values(students_list);
	return { students: students, tot_students: size };
};

function getById(id) {
	if (students_list[id]) {
		return students_list[id];
	} else {
		console.log('Student with id ' + id + ' does not exist');
		return null;
	}
};

// email IS UNIQUE => return null or 1 item
function getByEmail(email) {
	for (id in students_list) {
		if (students_list[id].email === email) {
			return students_list[id];
		}
	}
	return null;
};

function addStudent(email, firstname, lastname) {
	if (getByEmail(email)) {
		console.log(`Unable to add ${email}: email already registered`);
		return null;
	}
	let stud = new Student(email, firstname, lastname);
	students_list[stud.id] = stud;
	size++;
	console.log(`Added ${stud}`);
	return stud;
};

function addStudentWithID(id, email, firstname, lastname) {
	if (getByEmail(email)) {
		console.log(`Unable to add ${email}: email already registered`);
		return null;
	}
	let stud = new Student(email, firstname, lastname);
	stud.id = id;
	students_list[stud.id] = stud;
	size++;
	console.log(`Added using passed id ${stud}`);
	return stud;
}

function updateStudent(id, email, firstname, lastname) {
	if (students_list[id]) {
		students_list[id].firstname = firstname;
		students_list[id].lastname = lastname;
		console.log(`Modified student ${students_list[id]}`);
		return 200;
	} else if(getByEmail(email)){
		return 423;
	} else {
		addStudentWithID(id, email, firstname, lastname);
		return 201;
	}
}

function deleteStudent(id) {
	if (students_list[id]) {
		console.log(`Deleted student ${students_list[id]}`);
		delete students_list[id];
		size--;
		return true;
	}
	return false;
}

module.exports = { getAllIDs, getAllStudents, getById, getByEmail, addStudent, updateStudent, deleteStudent, addStudentWithID };
