import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import EntryDispersalDashboard from '../screens/shared/entryDispersal/EntryDispersalDashboard';
import PhoneVerification from '../screens/shared/entryDispersal/PhoneVerification';
import GenerateQR from '../screens/shared/entryDispersal/GenerateQR';
import ScanQR from '../screens/shared/entryDispersal/ScanQR';
import RegisterEscort from '../screens/parent/entryDispersal/RegisterEscort';
import EscortView from '../screens/parent/entryDispersal/EscortView';

export type RootStackParamList = {
  classId?: string;
  class_name?: string;
};

export type EDStackParamList = {
  EDDashboard: {
    role: 'staff' | 'parent';
  } & RootStackParamList;
  PhoneVerification: undefined;
  GenerateQR: undefined;
  ScanQR: undefined;
  RegisterEscort:
    | {
        action: 'add';
      }
    | {
        action: 'edit';
        escort: EscortType;
      };
  EscortView: {
    escortId: string;
  };
};

const Stack = createNativeStackNavigator<EDStackParamList>();

const EntryDispersalStack = ({
  route
}: NativeStackScreenProps<EDStackParamList, 'EDDashboard'>) => {
  return (
    <Stack.Navigator
      initialRouteName="EDDashboard"
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen
        name="EDDashboard"
        component={EntryDispersalDashboard}
        initialParams={route.params}
      />
      <Stack.Screen name="PhoneVerification" component={PhoneVerification} />
      <Stack.Screen name="GenerateQR" component={GenerateQR} />
      <Stack.Screen name="ScanQR" component={ScanQR} />
      <Stack.Screen name="RegisterEscort" component={RegisterEscort} />
      <Stack.Screen name="EscortView" component={EscortView} />
    </Stack.Navigator>
  );
};

export default EntryDispersalStack;
