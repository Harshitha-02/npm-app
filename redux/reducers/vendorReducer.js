import { FETCH_VENDOR_DETAILS_REQUEST, FETCH_VENDOR_DETAILS_SUCCESS, FETCH_VENDOR_DETAILS_FAILURE } from '../constants/vendorConstants';

const initialState = {
  vendorDetails: [],
  loading: false,
  error: null,
};

const vendorReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VENDOR_DETAILS_REQUEST:
      console.log('Reducer: FETCH_VENDOR_DETAILS_REQUEST');
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_VENDOR_DETAILS_SUCCESS:
      console.log('Reducer: FETCH_VENDOR_DETAILS_SUCCESS', action.payload);
      return {
        ...state,
        loading: false,
        vendorDetails: action.payload,
      };
    case FETCH_VENDOR_DETAILS_FAILURE:
      console.log('Reducer: FETCH_VENDOR_DETAILS_FAILURE', action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default vendorReducer;
