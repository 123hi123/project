document.addEventListener('DOMContentLoaded', () => {
    const reportType = document.getElementById('reportType');
    const periods = document.getElementById('periods');
    const queryButton = document.getElementById('queryButton');
    const ctx = document.getElementById('salesChart').getContext('2d');
    let chart;

    queryButton.addEventListener('click', fetchSalesData);

    async function fetchSalesData() {
        const type = reportType.value;
        const periodsValue = parseInt(periods.value);

        if (periodsValue < 1 || periodsValue > 10) {
            alert('週期數量必須在 1 到 10 之間');
            return;
        }

        const requestData = {
            type: type,
            periods: periodsValue
        };

        if (type === 'day') {
            requestData.day_of_week = new Date().getDay();
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/sales_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            updateChart(data);
        } catch (error) {
            console.error('Error:', error);
            alert('獲取數據時出錯');
        }
    }

    function updateChart(data) {
        const labels = data.data.map(item => item.period_label);
        const totalValues = data.data.map(item => item.total_value);
        const totalQuantities = data.data.map(item => item.total_quantity);
        const avgPrices = data.data.map(item => item.total_value / item.total_quantity);

        const datasets = [
            {
                label: '總銷售額',
                data: totalValues,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: '總銷售數量',
                data: totalQuantities,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: '單品銷售平均價格',
                data: avgPrices,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ];

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: '銷售報表'
                    }
                }
            }
        });
    }
});
