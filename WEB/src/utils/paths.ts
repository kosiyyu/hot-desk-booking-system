import axios from 'axios';

const getAvailabilityArray = async (dateOnlyString: string) => {
  const resp = await axios.get(
    `http://localhost:5106/api/desk/availability/${dateOnlyString}`,
  );
  console.log(resp.data);
  return resp.data;
};
