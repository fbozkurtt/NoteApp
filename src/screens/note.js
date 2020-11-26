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
    save = async () => {
        if (this.state.values.note.length == 0)
            return;
        if (this.state.values.name == '') {
            this.setState({ values: { ...this.state.values, name: Date.now().toString() } });
        }
        try {
            const notesValueRaw = await AsyncStorage.getItem("notes");
            const notesValue = JSON.parse(notesValueRaw) ?? [];
            if (!notesValue.map(w => w.name == this.state.values.name).includes(true)) {
                notesValue.push(this.state.values);
            }
            else {
                var o = notesValue.map(w => w.name === this.state.values.name)[0];
                var i = notesValue.indexOf(o);
                notesValue.splice(i, 1, this.state.values)
            }
            await AsyncStorage.setItem(
                "notes",
                JSON.stringify(notesValue)
            );
        } catch (error) {
            console.log(error)
        }


    }

    // save = () => {
    //     Actions.home({ note: this.state.values.note, name: this.state.values.name })
    // }

    // onBtnClick=()=>{
    //     this.setState({ name: Date.now().toString() });
    //     if (this.state.name == '') {
    //         this.setState({ name: Date.now().toString() });
    //     }
    // }
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
                                this.save().then(()=>{
                                    Actions.home();
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
                    //onChangeText={(value) => this.note(value)}
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
        // justifyContent: 'center',
        // alignItems: 'center',
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