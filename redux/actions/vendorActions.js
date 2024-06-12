import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { FETCH_VENDOR_DETAILS_REQUEST, FETCH_VENDOR_DETAILS_SUCCESS, FETCH_VENDOR_DETAILS_FAILURE } from '../constants/vendorConstants';

export const fetchVendorDetails = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_VENDOR_DETAILS_REQUEST });
    console.log('FETCH_VENDOR_DETAILS_REQUEST dispatched');

    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'vendors'));
      let vendorDetails = [];
      querySnapshot.forEach((doc) => {
        vendorDetails.push({ id: doc.id, ...doc.data() });
      });
      console.log('Vendor details fetched:', vendorDetails);
      dispatch({
        type: FETCH_VENDOR_DETAILS_SUCCESS,
        payload: vendorDetails,
      });
      console.log('FETCH_VENDOR_DETAILS_SUCCESS dispatched');
    } catch (error) {
      console.error('Error fetching vendor details:', error.message);
      dispatch({
        type: FETCH_VENDOR_DETAILS_FAILURE,
        payload: error.message,
      });
      console.log('FETCH_VENDOR_DETAILS_FAILURE dispatched');
    }
  };
};
