import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { fetchVendorDetails } from '../../redux/actions/vendorActions'; // Ensure this path is correct

const HomeScreen = ({ vendorDetails, loading, error, fetchVendorDetails }) => {
  useEffect(() => {
    console.log('Fetching vendor details...');
    fetchVendorDetails();
  }, [fetchVendorDetails]);

  useEffect(() => {
    console.log('vendorDetails:', vendorDetails);
    console.log('loading:', loading);
    console.log('error:', error);
  }, [vendorDetails, loading, error]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : vendorDetails && vendorDetails.length > 0 ? (
        vendorDetails.map((vendor) => (
          <View key={vendor.id}>
            <Text>{vendor.displayName}</Text>
          </View>
        ))
      ) : (
        <Text>No Vendor Details Available</Text>
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  vendorDetails: state.vendor.vendorDetails,
  loading: state.vendor.loading,
  error: state.vendor.error,
});

export default connect(mapStateToProps, { fetchVendorDetails })(HomeScreen);
