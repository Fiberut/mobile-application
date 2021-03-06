import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';

import {
  ScrollView,
  View,
  Picker,
} from 'react-native';
import { Button, List, FormInput } from 'react-native-elements';

import randomWord from 'random-words';
import EditableStep from './EditableStep';
import createArrayFromRange from '../../../../helpers/createArrayFromRange';

const stepInitialState = {
  label: '',
  metadata: {
    reps: 10,
  },
};

class WorkoutCreatorScreen extends Component<*> {
  constructor(props) {
    super(props);
    this.state = {
      step: stepInitialState,
      workoutSteps: [],
    };
  }

  getCurrentStep = ({ label, metadata }) => ({
    type: 'GYM',
    label,
    metadata,
  })

  addStep = () => {
    const nextStep = this.state.step;

    /* NOTE dev shortcut */
    if (process.env.NODE_ENV === 'development' && !nextStep) {
      this.setState({
        step: '',
        workoutSteps: [...this.state.workoutSteps, randomWord()],
      });
    }
    if (!nextStep) return;

    nextStep.id = uuidv4();

    this.setState({
      step: stepInitialState,
      workoutSteps: [...this.state.workoutSteps, nextStep],
    });
  }

  deleteStep = (index) => {
    const copy = this.state.workoutSteps.slice();
    copy.splice(index, 1);
    this.setState({
      workoutSteps: copy,
    });
  }

  continue = () => {
    if (this.state.workoutSteps.length > 0) {
      this.props.onContinue({ workoutSteps: this.state.workoutSteps });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View>
            <FormInput
              placeholder="Step name (ex: push-ups)"
              onChangeText={label => this.setState({ step: { ...this.state.step, label } })}
              value={this.state.step.label}
            />
            <Picker
              selectedValue={this.state.step.metadata.reps}
              onValueChange={reps => this.setState({
                step: { ...this.state.step, metadata: { ...this.state.step.metadata, reps } },
              })}
            >
              {
                createArrayFromRange(1, 50).map(i => (
                  <Picker.Item key={i} label={`${i} reps`} value={i} />
                ))
              }
            </Picker>
          </View>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Button
              raised
              icon={{ name: 'add' }}
              title="ADD"
              color="#FFFFFF"
              backgroundColor="#D81E5B"
              onPress={this.addStep}
            />
          </View>
          <List containerStyle={{ marginBottom: 20 }}>
            {this.state.workoutSteps.map((step, idx) => (
              <EditableStep
                key={step.id}
                step={step}
                onDelete={() => this.deleteStep(idx)}
              />
            ))}
          </List>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Button
              raised
              icon={{ name: 'done' }}
              title="CREATE"
              color="#FFFFFF"
              backgroundColor="#D81E5B"
              onPress={this.continue}
              disabled={this.state.workoutSteps.length === 0}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default WorkoutCreatorScreen;
