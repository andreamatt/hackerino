const teachers_list = {
	/*
	1: {
		id: 1,
		email: fabio.casati@unitn.it,
		first_name: fabio,
		last_name: casati
	}
	*/
};

function Teacher(email, first_name, last_name) {
	this.id = 1;
	while (teachers_list[this.id]) {
		this.id++;
	}
	this.email = email;
	this.first_name = first_name;
	this.last_name = last_name;
}

module.exports = { teachers_list, Teacher };