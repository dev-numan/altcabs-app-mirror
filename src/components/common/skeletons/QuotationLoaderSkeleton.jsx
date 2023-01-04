import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const QuotationLoaderSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item
        flexDirection="row"
        marginTop={10}
        alignItems="center">
        {/* <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} /> */}
        <SkeletonPlaceholder.Item marginLeft={20} width="100%">
          <SkeletonPlaceholder.Item width={220} height={20} />
          <SkeletonPlaceholder.Item marginTop={6} width={220} height={30} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default QuotationLoaderSkeleton;
