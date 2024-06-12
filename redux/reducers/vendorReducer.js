// reducers/vendorReducer.js
import {
  FETCH_VENDOR_DETAILS_REQUEST,
  FETCH_VENDOR_DETAILS_SUCCESS,
  FETCH_VENDOR_DETAILS_FAILURE,
  SET_USER_DETAILS,
} from '../constants/vendorConstants';

const initialState = {
  vendorDetails: [],
  loading: false,
  error: null,
};

const vendorReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VENDOR_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_VENDOR_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        vendorDetails: action.payload,
      };
    case FETCH_VENDOR_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
    default:
      return state;
  }
};

export default vendorReducer;
