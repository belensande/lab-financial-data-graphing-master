$(document).ready(function () {
	let now = new Date();
	let maxnDate = now.toISOString().substring(0, 10);
	$('#toDate').prop('max', maxnDate);

	getFinancialData().then(data => {
		loadChar(data);
	});

	$("#fromDate").on("change", function () {
		$('#toDate').prop('min', $(this).val());
		getFinancialData($(this).val(), $('#toDate').val(), $('#currency').val()).then(data => {
			loadChar(data);
		});;
	});

	$("#toDate").on("change", function () {
		$('#fromDate').prop('max', $(this).val());
		getFinancialData($('#fromDate').val(), $(this).val(), $('#currency').val()).then(data => {
			loadChar(data);
		});;
	});

	$("#currency").on("change", function () {
		getFinancialData($('#fromDate').val(), $('#toDate').val(), $(this).val()).then(data => {
			loadChar(data);
		});;
	});
});

function getFinancialData(fromDate, toDate, currency) {
	let params = "";
	if (fromDate && toDate && currency) {
		params = `?start=${fromDate}&end=${toDate}&currency=${currency}`;
		console.log(params);
	}
	return axios.get(`http://api.coindesk.com/v1/bpi/historical/close.json${params}`)
		.then(response => {
			console.log('get success');
			console.log(response);params
			return response.data.bpi;
		})
		.catch(error => {
			console.log('Oh No! Error!');
			console.log(error);
			return Promise.reject(error);
		});
}

function createChart(labels, points) {
	let ctx = $("#myChart");

	let myLineChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				data: points,
				label: 'Bitcoin Price Index'

			}]
		}
	});
}

function loadChar(data) {
	let labels = Object.keys(data);
	let dataset = Object.values(data);
	createChart(labels, dataset);
	$("#fromDate").val(labels[0]);
	$("#toDate").val(labels[labels.length - 1]);
	$('#toDate').prop('min', $('#fromDate').val());
	$('#fromDate').prop('max', $('#toDate').val());
	$('#max').empty();
	$('#max').text(`${Math.max.apply(Math, dataset)} ${$('#currency').val()}`);
	$('#min').empty();
	$('#min').text(`${Math.min.apply(Math, dataset)} ${$('#currency').val()}`);
}