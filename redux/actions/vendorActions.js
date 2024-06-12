// actions/vendorActions.js
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { FETCH_VENDOR_DETAILS_REQUEST, FETCH_VENDOR_DETAILS_SUCCESS, FETCH_VENDOR_DETAILS_FAILURE, SET_USER_DETAILS } from '../constants/vendorConstants';

export const fetchVendorDetails = (userId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_VENDOR_DETAILS_REQUEST });
    console.log('FETCH_VENDOR_DETAILS_REQUEST dispatched');

    try {
      if (!userId) {
        throw new Error('User ID is undefined');
      }

      const db = getFirestore();
      const vendorsRef = collection(db, 'vendors');
      const vendorQuery = query(vendorsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(vendorQuery);

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

// New setUserDetails function
export const setUserDetails = (userDetails) => {
  return {
    type: SET_USER_DETAILS,
    payload: userDetails,
  };
};
