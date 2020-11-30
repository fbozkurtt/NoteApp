import React, { Component } from 'react';
import { View, Text, ScrollView, SafeAreaContent, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { TextInput } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
const { width, height } = Dimensions.get("window");


export default class NoteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                note: this.props.values.note ?? '',
                name: this.props.values.name ?? ''
            }
        }
    }
    findIndex = (arr) => {
        for (i = 0; i < arr.length; i++) {
            if (arr[i].name == this.state.values.name) {
                return i;
            }
        }
        return -1;
    }
    save = async () => {
        try {
            var index = -1;
            if (this.state.values.note.length == 0) {
                if (this.state.values.name == '') {
                    return;
                }
            }
            if (this.state.values.name == '') {
                this.setState({ values: { ...this.state.values, name: Date.now().toString() } });
            }
            const notesValueRaw = await AsyncStorage.getItem("notes");
            const notesValue = JSON.parse(notesValueRaw) ?? [];
            if (!notesValue.map(w => w.name == this.state.values.name).includes(true)) {
                console.log("girdi");
                notesValue.push(this.state.values);
                notesValue[notesValue.length - 1].key = `${notesValue.length - 1}`;
                //console.log(notesValue[-1]);
            }
            else {
                index = this.findIndex(notesValue);
                if (index > -1) {
                    if (this.state.values.note.length > 0) {
                        notesValue.splice(index, 1, this.state.values);
                    }
                    else {
                        notesValue.splice(index, 1);
                    }
                }
            }
            await AsyncStorage.setItem(
                "notes",
                JSON.stringify(notesValue)
            );
        } catch (e) {
            console.error(e)
        }


    }
    note = (e) => {
        this.setState({
            values: {
                ...values,
                note: e
            }
        })
    }
    render() {
        const { values } = this.state;
        return (
            <ScrollView style={styles.container}>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: '4%' }}>
                    <View style={{ alignItems: 'flex-start', }}>
                        <TouchableOpacity style={styles.button}
                            onPress={() => {
                                this.save().then(() => {
                                    //Actions.home()
                                    Actions.reset("home");
                                    //this.props.navigation.popToTop();
                                });
                            }}
                        >
                            <Image source={require("../../assets/back.png")} style={{ width: 30, height: 30 }} ></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'flex-end', marginLeft: width - (width / 10 + 65) }}>
                        <TouchableOpacity style={styles.button}
                            onPress={() => { this.save() }}
                        >
                            <Image source={require("../../assets/check.png")} style={{ width: 30, height: 30 }} ></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 11.5, }}>
                    <TextInput style={styles.addText}
                        value={this.state.values.note}
                        autoFocus={true}
                        multiline={true}
                        onChangeText={(value) => { this.setState({ values: { ...values, note: value } }) }}
                    ></TextInput>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    addText: {
        fontSize: 18,
        color: 'black',
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%'

    },
    button: {
        paddingLeft: 15
    }
})