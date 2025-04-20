import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../../constants/colors';
const FleetInfoLoaderSkeleton = () => {
  return (
    <SkeletonPlaceholder
      borderRadius={10}
      backgroundColor={colors.GRAY_LIGHT}
      highlightColor={colors.BACKGROUND}>
      <SkeletonPlaceholder.Item
        flexDirection="row"
        marginTop={10}
        alignItems="center">
        {/* <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} /> */}
        <SkeletonPlaceholder.Item marginLeft={20} width="100%">
          <SkeletonPlaceholder.Item width={220} height={30} />
          <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
          <SkeletonPlaceholder.Item width={120} height={40} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default FleetInfoLoaderSkeleton;
