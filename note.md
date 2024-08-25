npx react-native init project1 -- version 0.70
npx react-devtools
npm install react-native
npm install @react-navigation/native  
npx @react-native-community/cli doctor

git add .
git commit -m "hi"
git pull origin master

#rnfe
<View>
<Text style={styles.title}>Quick Add</Text>
{/_ Card _/}
<View style={styles.card}>
<View>
{/_ avatar+title _/}
<Image
source={{ uri: 'https://via.placeholder.com/50' }}
style={{
                                width: 60,
                                height: 60,
                                borderRadius: 10,
                            }}
/>
<View>
<View style={styles.boardItem}>
<Text style={styles.boardTitle}>{item.title}</Text>
<Text>{item.description}</Text>
</View>
<Icon
                                name="supervisor-account"
                                size={17}
                                color={COLORS.white}
                            />
</View>
</View>
<UIButton
                        title="Add Card"
                        onPress={{}}
                        textColor="white"
                        borderColor={COLORS.Main}
                        btnColor="#0C66E4"
                        marginVer={30}
                    />
</View>
</View>
