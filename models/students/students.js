const students_list = {
	/*
	1: {
		id: 1,
		email: andrea.matte@povo.it,
		first_name: andrea,
		last_name: matte
	}
	*/
};

function Student(email, first_name, last_name) {
	this.id = 1;
	while (students_list[this.id]) {
		this.id++;
	}
	this.email = email;
	this.first_name = first_name;
	this.last_name = last_name;
}

module.exports = { students_list, Student };