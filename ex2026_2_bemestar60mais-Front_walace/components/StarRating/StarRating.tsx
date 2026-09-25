import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
}

export default function StarRating({ value = 0, onChange }: StarRatingProps) {
  const [rating, setRating] = useState(value);

  const handlePress = (newRating: number) => {
    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starNumber = index + 1;
        return (
          <TouchableOpacity
            key={starNumber}
            onPress={() => handlePress(starNumber)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={starNumber <= rating ? "star" : "star-outline"}
              size={32}
              color={starNumber <= rating ? "#FFD700" : "#CCCCCC"} // amarelo ou cinza
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
});