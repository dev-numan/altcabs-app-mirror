import React from 'react';
import {View, Text} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../../constants/colors';
const QuotationLoaderSkeleton = () => {
  return (
    <>
      <Text style={{color: 'white'}}>Loader Skeleton</Text>
      <SkeletonPlaceholder borderRadius={4} marginBottom={30}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          marginTop={10}
          alignItems="center">
          {/* <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} /> */}
          <SkeletonPlaceholder.Item marginLeft={20} width="100%">
            <SkeletonPlaceholder.Item
              width={220}
              height={20}
              backgroundColor={colors.YELLOW}
              opacity={70}
            />
            <SkeletonPlaceholder.Item marginTop={6} width={220} height={30} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </>
  );
};

export default QuotationLoaderSkeleton;
