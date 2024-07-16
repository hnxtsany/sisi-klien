import moment from 'moment-timezone';
import 'moment/locale/id'; // Import locale bahasa Indonesia

moment.locale('id'); // Set locale ke bahasa Indonesia

export default function formatDate(dateString) {
    return moment(dateString).format('D MMMM YYYY');
}
