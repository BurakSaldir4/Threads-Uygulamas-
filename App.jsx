import { StatusBar } from "expo-status-bar";
import "./global.css";
import { Text, View } from "react-native";
import StackNavigator from "./StackNavigator";
import {UserContext} from "./UserContext"

export default function App() {
	return (
		<>
			<UserContext>
				<StackNavigator />
			</UserContext>
		</>
	);

}
